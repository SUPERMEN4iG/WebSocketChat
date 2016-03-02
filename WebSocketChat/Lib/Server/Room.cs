using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebSocketChat.Lib.Server
{
   public sealed class Room : BaseClass, IDisposable
   {
      public IDictionary<Guid, Client> ClientList { get; set; }
      public IDictionary<Guid, Message> MessagesList { get; set; }
      public string RoomName { get; set; }
      public bool isClosed { get; set; }
      public bool isCreated { get; set; }
      public uint MaxClientCount { get; set; }
      public Client Creator { get; set; }
      public const string DefaultRoomName = "HomeLobby";
      private const uint DefaultClientCount = 100;

      public Room()
      {
         RoomName = DefaultRoomName;
         MaxClientCount = 100;
         ClientList = new Dictionary<Guid, Client>();
         MessagesList = new Dictionary<Guid, Message>();
      }

      public Room(string roomName, IDictionary<Guid, Client> clients)
      {
         RoomName = roomName;
         MaxClientCount = DefaultClientCount;
         ClientList = clients;
      }

      public Room(string roomName, uint maxClientcount, IDictionary<Guid, Client> clients)
      {
         RoomName = roomName;
         MaxClientCount = maxClientcount;
         ClientList = clients;
      }

      public bool AddClient(Guid clientGuid, Client client)
      {
         if (!isCreated)
            Creator = client;

         if (ClientList.Count > MaxClientCount)
            throw new ApplicationException("No more space in the room");

         ClientList.Add(clientGuid, client);
         isCreated = true;

         return true;
      }

      public bool RemoveClient(Guid clientGuid)
      {
         ClientList.Remove(clientGuid);
         return true;
      }

      public void CreateRoom()
      {
         WebSocketDictionary.RoomList.Add(Guid.NewGuid(), this);
      }

      public void CloseRoom()
      {
         this.isClosed = true;
      }

      public void DeleteRoom()
      {
         this.Dispose();
      }

      public void Dispose()
      {
         this.ClientList = null;
         this.MessagesList = null;
         GC.Collect();
      }
   }
}