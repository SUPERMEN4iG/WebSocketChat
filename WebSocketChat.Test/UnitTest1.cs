using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using WebSocketChat.Lib.Server.Game;

namespace WebSocketChat.Test
{
  [TestClass]
  public class UnitTest1
  {
    [TestMethod]
    public void TestMethod1()
    {

      String str = "[0,1]";

      //int[] values = str.Split(',').Select(h => Int32.Parse(h)).ToArray();

      Array arr = Regex.Matches(str, @"\b[0-9]+\b")
                .Cast<Match>()
                .Select(m => m.Value)
                .ToArray();

      System.Diagnostics.Trace.WriteLine(String.Format("{0} {1}", arr.GetValue(0), arr.GetValue(1)));
    }

     [TestMethod]
    public void TestCreateGestureDamage()
    {
       AttackGestureDamage attackGestureDamage = new AttackGestureDamage(GestureDamage.GestureDamageType.Attack, new GesturePlayer(), new GesturePlayer(), 5);

       Assert.IsNull(attackGestureDamage);
    }
  }
}
