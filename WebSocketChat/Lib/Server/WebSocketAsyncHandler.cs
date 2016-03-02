namespace WebSocketChat.Lib.Server
{
  using System;
  using System.Collections.Generic;
  using System.Diagnostics;
  using System.Diagnostics.CodeAnalysis;
  using System.Net;
  using System.Net.WebSockets;
  using System.Text;
  using System.Threading;
  using System.Threading.Tasks;
  using System.Web;
  using System.Web.WebSockets;
  using WebSocketChat.Lib.Extensions;


    public abstract class WebSocketAsyncHandler : HttpTaskAsyncHandler
    {
      public override bool IsReusable
      {
        get
        {
          return false;
        }
      }

      private WebSocket Socket { get; set; }
      public AspNetWebSocketContext WebSocketContext { get; set; }
      protected object _syncRoot = new object();

      public override async Task ProcessRequestAsync(HttpContext httpContext)
      {
          await Task.Factory.StartNew(() =>
          {
            if (httpContext.IsWebSocketRequest)
            {
              httpContext.AcceptWebSocketRequest(async delegate(AspNetWebSocketContext context)
              {
                this.Socket = context.WebSocket;
                this.WebSocketContext = context;

                while (this.Socket != null || this.Socket.State != WebSocketState.Closed)
                {
                  ArraySegment<byte> buffer = new ArraySegment<byte>(new byte[1024]);
                  WebSocketReceiveResult receiveResult = await this.Socket.ReceiveAsync(buffer, CancellationToken.None);
                  try
                  {
                    switch (receiveResult.MessageType)
                    {
                      case WebSocketMessageType.Text:
                        string message = Encoding.UTF8.GetString(buffer.Array, 0, receiveResult.Count);
                        Message parserMessage = Newtonsoft.Json.JsonConvert.DeserializeObject<Message>(message);
                        this.OnMessageReceived(parserMessage);
                        break;
                      case WebSocketMessageType.Binary:
                        this.OnMessageReceived(buffer.Array);
                        break;
                      case WebSocketMessageType.Close:
                        this.OnClosing(true, receiveResult.CloseStatusDescription);
                        break;
                    }

                    switch (this.Socket.State)
                    {
                      case WebSocketState.Connecting:
                        this.OnConnecting();
                        break;
                      case WebSocketState.Open:
                        this.OnOpen();
                        break;
                      case WebSocketState.CloseSent:
                        this.OnClosing(false, string.Empty);
                        break;
                      case WebSocketState.CloseReceived:
                        this.OnClosing(true, string.Empty);
                        break;
                      case WebSocketState.Closed:
                        this.OnClosed();
                        break;
                    }
                  }
                  catch (Exception ex)
                  {
                    this.OnError(ex);
                  }
                }
              });
            }
          });
      }

      protected virtual void OnConnecting()
      {
      }

      protected virtual void OnOpen()
      {
      }

      protected virtual void OnMessageReceived(Message message)
      {
          
      }

      protected virtual void OnMessageReceived(string message)
      {
        lock (_syncRoot)
        {
          //ТРА-ТА-ТА-ТА
        }
      }

      public async Task SendMessageAsync(string message, WebSocket socket)
      {
        await SendMessageAsync(Encoding.UTF8.GetBytes(message), socket);
      }

      private async Task SendMessageAsync(byte[] message, WebSocket socket)
      {
        await socket.SendAsync(
            new ArraySegment<byte>(message),
            WebSocketMessageType.Text,
            true,
            CancellationToken.None);
      }

      protected virtual void OnMessageReceived(byte[] bytes)
      {
      }

      protected virtual void OnClosing(bool isClientRequest, string message)
      {
        lock (_syncRoot)
        {
        }
      }

      protected virtual void OnClosing(Guid Guid, bool isClientRequest, string message)
      {
        lock (_syncRoot)
        {
          using (Client client = new Client())
          {
            WebSocketDictionary.ClientList.Remove(Guid);
          };
            
          Socket.CloseAsync(WebSocketCloseStatus.NormalClosure, message, CancellationToken.None);
          Socket.Dispose();
        }
      }

      protected virtual void OnClosed()
      {

      }

      protected virtual void OnError(Exception ex)
      {
      }

      [DebuggerStepThrough]
      protected async Task SendMessageAsync(byte[] message)
      {
          await this.SendMessageAsync(message, WebSocketMessageType.Binary);
      }

      [DebuggerStepThrough]
      protected async Task SendMessageAsync(string message)
      {
          await this.SendMessageAsync(Encoding.UTF8.GetBytes(message), WebSocketMessageType.Text);
      }

      private async Task SendMessageAsync(byte[] message, WebSocketMessageType messageType)
      {
          await this.Socket.SendAsync(
              new ArraySegment<byte>(message),
              messageType,
              true,
              CancellationToken.None);
      }
    }
}
