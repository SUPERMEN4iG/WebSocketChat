using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebSocketChat.Lib.Server.Game
{
   interface IGestureDamage
   {
      GestureDamage.GestureDamageType DamageType { get; set; }
      GesturePlayer From { get; set; }
      GesturePlayer To { get; set; }
   }

   public class AttackGestureDamage : GestureDamage
   {
      public int Health { get; set; }

      public AttackGestureDamage(GestureDamage.GestureDamageType damageType, GesturePlayer from, GesturePlayer to, int health) : base(damageType, from, to)
      {
         this.Health = health;
      }
   }

   public class GestureDamage : IGestureDamage
   {
      public enum GestureDamageType
      {
         Attack,
         Skill
      }

      public GestureDamage.GestureDamageType DamageType { get; set; }
      public GesturePlayer From { get; set; }
      public GesturePlayer To { get; set; }

      public GestureDamage(GestureDamage.GestureDamageType damageType, GesturePlayer from, GesturePlayer to)
      {
         this.DamageType = damageType;
         this.From = from;
         this.To = to;
      }
   }
}