using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebSocketChat.Lib.Server.Game
{
   [Serializable]
   public class GestureException__PlayerNotConnected : ApplicationException
   {
      public GestureException__PlayerNotConnected() : base() { }
      public GestureException__PlayerNotConnected(String message) : base(String.Format("Player {0} is not connected", message)) { }
   }
}