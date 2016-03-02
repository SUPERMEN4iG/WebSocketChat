using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace WebSocketChat.Lib.Extensions
{
  public static class Parser
  {
    public static string ToJSON(this object o)
    {
      return JsonConvert.SerializeObject(o);
    }

    public static TEnum ToEnum<TEnum>(this string strEnumValue, TEnum defaultValue)
    {
      if (!Enum.IsDefined(typeof(TEnum), strEnumValue))
        return defaultValue;

      return (TEnum)Enum.Parse(typeof(TEnum), strEnumValue);
    }

    public static double UnixTicks(this DateTime dt)
    {
      DateTime d1 = new DateTime(1970, 1, 1);
      DateTime d2 = dt.ToUniversalTime();
      TimeSpan ts = new TimeSpan(d2.Ticks - d1.Ticks);
      return ts.TotalMilliseconds;
    }

    public static string GetIpAddress()  // Get IP Address
    {
      string ip = "";
      IPHostEntry ipEntry = Dns.GetHostEntry(GetCompCode());
      IPAddress[] addr = ipEntry.AddressList;
      ip = addr[2].ToString();
      return ip;
    }

    public static string GetCompCode()  // Get Computer Name
    {
      string strHostName = "";
      strHostName = Dns.GetHostName();
      return strHostName;
    }

  }
}