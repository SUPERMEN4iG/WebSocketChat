using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.WebSockets;

namespace WebSocketChat
{
  public abstract class BaseClass
  {
    public Guid Id { get; set; }
    public DateTime CreationDateTime { get; set; }

    public BaseClass()
    {
      Id = Guid.NewGuid();
      CreationDateTime = DateTime.Now;
    }
  }

  public class Client : BaseClass, IDisposable
  {
    public string Name { get; set; }
    public AspNetWebSocketContext WebSocketContext { get; set; }
    public bool isConnected { get { return this.WebSocketContext.IsClientConnected; } }

    public Client(string userName, AspNetWebSocketContext webSocketContext)
    {
      Name = userName;
      WebSocketContext = webSocketContext;
    }

    public Client(Guid userGuid, string userName, AspNetWebSocketContext webSocketContext)
    {
      Id = userGuid;
      Name = userName;
      WebSocketContext = webSocketContext;
    }

    public Client() { }

    public void Dispose()
    {
      GC.SuppressFinalize(this);
    }
  }
}