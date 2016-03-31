using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebSocketChat;

namespace WebSocketChat.Lib.Server.Game
{
   public class GesturePlayer : Client
   {
      public float Health { get; set; }
      public ulong Points { get; set; }
      public bool IsReady { get; set; }

      public GesturePlayer() : base() { }
      public GesturePlayer(string userName, System.Web.WebSockets.AspNetWebSocketContext webSocketContext) : base(userName, webSocketContext) { }
      public GesturePlayer(Guid userGuid, string userName, System.Web.WebSockets.AspNetWebSocketContext webSocketContext) : base(userGuid, userName, webSocketContext) { }
   }
}