using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebSocketChat.Lib.Server;

namespace WebSocketChat.Lib.Server.Game
{
   public interface IGestureGame
	{
      GesturePlayer player1 { get; set; }
      GesturePlayer player2 { get; set; }

      bool IsStarted { get; }
      GestureGame.GestureGameState GameState { get; set; }

      void StartGame();
      void StartGame(GesturePlayer p1, GesturePlayer p2);
      void StopGame();
      void PauseGame();
	}

   public class GestureGame : IGestureGame
   {
      public enum GestureGameState : int
      {
         Running = 2,
         Stopped = 4,
         Paused = 8,
      }

      public GesturePlayer player1 { get; set; }
      public GesturePlayer player2 { get; set; }

      public bool IsStarted { get { return (this.GameState == GestureGame.GestureGameState.Running); } }
      public GestureGame.GestureGameState GameState { get; set; }

      public void StartGame()
      {
         throw new NotImplementedException();
      }

      public void StartGame(GesturePlayer p1, GesturePlayer p2)
      {
         if (!(player1.isConnected && player1.IsReady))
            throw new GestureException__PlayerNotConnected(player1.Name);

         if (!(player1.isConnected && player1.IsReady))
            throw new GestureException__PlayerNotConnected(player2.Name);

         this.player1 = p1;
         this.player2 = p2;
         this.GameState = GestureGameState.Running;
      }

      public void StopGame()
      {
         throw new NotImplementedException();
      }

      public void PauseGame()
      {
         throw new NotImplementedException();
      }
   }
}