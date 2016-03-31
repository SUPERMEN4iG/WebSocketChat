using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace WebSocketChat
{
   public class DamageGestureGameMessage : GestureGameMessage
   {
      public DamageGestureGameMessage() : base()
      {
         this.Type = GestureGameMessageType.Damage;
      }
      public WebSocketChat.Lib.Server.Game.GestureDamage Damage { get; set; }
   }

   [JsonConverter(typeof(StringEnumConverter))]
   public class GestureGameMessage : Message
   {
      public GestureGameMessage() : base() { }

      public enum GestureGameMessageType
      {
         Open = Message.MessageType.Open,
         Close = Message.MessageType.Close,
         Error = Message.MessageType.Error,
         Text = Message.MessageType.Text,
         Move,
         Damage
      }

      internal new GestureGameMessageType Type { get; set; }
   }

  public class Message
  {
    [JsonConverter(typeof(StringEnumConverter))]
    internal MessageType Type { get; set; }
    public string UserName { get; set; }
    public string Text { get; set; }
    [JsonIgnore]
    public Client User { get; set; }
    public Guid ClientGuid { get; set; }

    private readonly int _CommandNamePosition = 0;
    private readonly int _UserPosition = 1;
    private readonly int _MessagePosition = 2;

    public enum MessageType
    {
      Open,
      Close,
      Error,
      Text,
      Command
    }

    public static MessageType GetMessageType(string messageType)
    {
      if (!Enum.IsDefined(typeof(MessageType), messageType))
      {
        throw new Exception("Unsuccessful parse to enum");
      }

      return (Message.MessageType)Enum.Parse(typeof(Message.MessageType), messageType);
    }

    public Message() { }

    public string GetMessage()
    {
      string[] separators = { ",", ".", "!", "?", ";", ":", " " };

      string str = (new Regex(GetCommandName())).Replace(Text, String.Empty, 1);
      str = (new Regex(separators[5])).Replace(str, String.Empty, 1);
      str = (new Regex(separators[6])).Replace(str, String.Empty, 2);

      return str;
    }

    public bool IsCommandMessage()
    {
      if (Regex.IsMatch(Text[0].ToString(), "/"))
        return true;
      else
        return false;
    }

    /// <summary>
    /// Получить соощение команды
    /// </summary>
    /// <returns></returns>
    public string GetCommandName()
    {
      return GetStringByPosition(_CommandNamePosition);
    }

    /// <summary>
    /// Получить имя юзера
    /// </summary>
    /// <returns></returns>
    public string GetUserName()
    {
      return GetStringByPosition(_UserPosition);
    }

    public string GetMessageUser()
    {
      return GetStringByPosition(_MessagePosition);
    }

    /// <summary>
    /// Подготавливаю строку в массив слов
    /// </summary>
    /// <returns>Массив слов</returns>
    protected string[] PrepareToString()
    {
      string[] separators = { ",", ".", "!", "?", ";", ":", " " };
      string[] words = Text.Split(separators, StringSplitOptions.RemoveEmptyEntries);

      return words;
    }

    /// <summary>
    /// Возьму слово по позиции в массиве слов
    /// </summary>
    /// <param name="position">Позиция в массиве</param>
    /// <returns>Слово по позиции</returns>
    protected string GetStringByPosition(int position)
    {
      string[] res = PrepareToString();
      if (res.Length <= position)
        Array.Resize(ref res, res.Length + 3);
      return res[position];
    }
  }
}