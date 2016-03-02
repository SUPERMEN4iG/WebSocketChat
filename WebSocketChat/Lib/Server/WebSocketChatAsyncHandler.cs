using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebSocketChat.Lib.Extensions;
using WebSocketChat;
using System.Threading.Tasks;
using WebSocketChat.Lib;

namespace WebSocketChat.Lib.Server
{
  public class WebSocketChatAsyncHandler : WebSocketAsyncHandler
  {
    private delegate void UserOperation(Message message);
    private Dictionary<Message.MessageType, UserOperation> _Operations;

    public WebSocketChatAsyncHandler()
    {
      _Operations = new Dictionary<Message.MessageType, UserOperation>
      {
        { Message.MessageType.Open, this.OnLogin },
        { Message.MessageType.Close, this.OnLogout },
        { Message.MessageType.Text, this.OnMessage },
        { Message.MessageType.Command, this.onCommandMessage }
      };
    }

    protected override void OnOpen()
    {
      base.OnOpen();
    }

    protected override void OnClosed()
    {
      base.OnClosed();
    }

    protected override void OnClosing(Guid Guid, bool isClientRequest, string message)
    {
      base.OnClosing(Guid, isClientRequest, message);
    }

    protected override void OnError(Exception ex)
    {
      base.OnError(ex);
      var task = this.SendMessageAsync((new Message() { Text = ex.Message, Type = Message.MessageType.Error }).ToJSON());
    }

    protected override void OnMessageReceived(Message message)
    {
      base.OnMessageReceived(message);

      lock (_syncRoot)
      {
        Message.MessageType messageType = message.Type;

        if (!_Operations.ContainsKey(messageType))
          throw new ApplicationException__ArgumentIsNotValid(messageType.ToString());

        _Operations[messageType](message);
      }
    }

    protected void OnLogin(Message message)
    {
      Task task;

      Guid clientGuid = Guid.NewGuid();
      Client client = new Client(message.UserName, this.WebSocketContext);
      WebSocketDictionary.ClientList.Add(clientGuid, client);

      message.Text = clientGuid.ToString();
      message.Type = Message.MessageType.Open;

      WebSocketDictionary.RoomList.Where(x => x.Value.RoomName == Room.DefaultRoomName).Select(r => 
      {
        return r.Value;
      }).FirstOrDefault(l => l.AddClient(clientGuid, client));

      task = this.SendMessageAsync(message.ToJSON(), client.WebSocketContext.WebSocket);

      //Room curRoom = WebSocketDictionary.RoomList.Where(x => x.Key == Guid.NewGuid()).Select(c => 
      //{
      //  return c.Value;
      //}).FirstOrDefault();

      //using (Room currentRoom = WebSocketDictionary.RoomList.Where(x => x.Key == Guid.NewGuid()).Select(c => c.Value).FirstOrDefault())
      //{
        
      //}
    }

    protected void OnLogout(Message message)
    {
      Guid userGuid;

      if (String.IsNullOrEmpty(message.Text))
        throw new ApplicationException__ArgumentNullException("message.Text");

      if (!Guid.TryParse(message.Text, out userGuid))
        throw new WebSocketChat.Lib.Extensions.ApplicationException("message.Text is not Guid");

      if (!WebSocketDictionary.ClientList.ContainsKey(new Guid(message.Text)))
        throw new ApplicationException__ArgumentIsNotValid("message.Text");

      using (Client currentClient = WebSocketDictionary.ClientList.Where(x => x.Key.ToString() == userGuid.ToString()).Select(u => u.Value).FirstOrDefault())
      {
        currentClient.WebSocketContext.WebSocket.Abort();
        WebSocketDictionary.ClientList.Remove(userGuid);

        WebSocketDictionary.RoomList.Where(x => x.Value.RoomName == Room.DefaultRoomName).Select(r =>
        {
          return r.Value;
        }).FirstOrDefault(l => l.RemoveClient(userGuid));
      }
    }

    protected void OnMessage(Message message)
    {
      if (String.IsNullOrEmpty(message.Text))
        throw new ApplicationException__ArgumentNullException("message.Text");

      if (!WebSocketDictionary.ClientList.ContainsKey(message.ClientGuid))
        throw new ApplicationException__ArgumentIsNotValid("message.ClientGuid");

      Task task;

      foreach(Guid key in WebSocketDictionary.ClientList.Keys)
      {
        if (WebSocketDictionary.ClientList[key].WebSocketContext.WebSocket.State == System.Net.WebSockets.WebSocketState.Open && WebSocketDictionary.ClientList[key].WebSocketContext.IsClientConnected == true)
        {
          task = SendMessageAsync(message.ToJSON(), WebSocketDictionary.ClientList[key].WebSocketContext.WebSocket);
        }
      }

      WebSocketDictionary.MessagesList.Add(Guid.NewGuid(), message);
    }

    protected void onCommandMessage(Message message)
    {
      if (String.IsNullOrEmpty(message.Text))
        throw new ApplicationException__ArgumentNullException("message.Text");

      if (!WebSocketDictionary.ClientList.ContainsKey(message.ClientGuid))
        throw new ApplicationException__ArgumentIsNotValid("message.ClientGuid");

      if (!message.IsCommandMessage())
        throw new WebSocketChat.Lib.Extensions.ApplicationException("It is not a command message");

      new CommandHandler().GetListener().Invoke(this, new CommandEventArgs(message));
    }
  }
}