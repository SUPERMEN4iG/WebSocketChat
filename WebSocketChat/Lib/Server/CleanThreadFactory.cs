using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;

namespace WebSocketChat.Lib.Server
{
  public class CleanThreadFactory
  {

    public static Thread CleanUpThread;

    static CleanThreadFactory() 
    {
      CleanUpThread = new Thread(CleanThreadHandler);
      CleanUpThread.Name = "WebSocket CleanUp Thread";
      CleanUpThread.Start();
    }

    private static void CleanThreadHandler() 
    {
      //TODO: Пересмотреть многопоточную логику, добавить Cancel-токен

      while (true)
      {
        Thread.Sleep(100);

        List<Client> currentConnection = new List<Client>();

        lock(WebSocketDictionary.ClientList)
        {
          currentConnection.AddRange(WebSocketDictionary.ClientList.Values);
        }

        foreach (Client connection in currentConnection)
        {
          if (!connection.isConnected)
          {
            lock (WebSocketDictionary.ClientList)
            {
              KeyValuePair<Guid, Client> client = WebSocketDictionary.ClientList.Where(x => x.Value.WebSocketContext == connection.WebSocketContext).FirstOrDefault();
              WebSocketDictionary.ClientList.Remove(client);
            }
          }
        }
      }
    }
  }
}