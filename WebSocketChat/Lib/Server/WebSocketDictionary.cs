using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Web;

namespace WebSocketChat.Lib.Server
{
  public class WebSocketDictionary
  {
    public static IDictionary<Guid, Client> ClientList = new Dictionary<Guid, Client>();
    public static IDictionary<Guid, Message> MessagesList = new Dictionary<Guid, Message>();
    //public static IDictionary<Guid, Dictionary<Guid, Client>> RoomList = new Dictionary<Guid, Dictionary<Guid, Client>>();
    public static IDictionary<Guid, Room> RoomList = new Dictionary<Guid, Room>();
  }
}