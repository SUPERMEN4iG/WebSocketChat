using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;

namespace WebSocketChat.Lib
{
  /// <summary>
  /// Аргументы для эвента команд
  /// </summary>
  public class CommandEventArgs : System.ComponentModel.CancelEventArgs
  {
    public Message Message { get; set; }

    public CommandEventArgs(Message msg)
    {
      Message = msg;
    }
  }

  /// <summary>
  /// Кастомные атрибуты для определения комманды
  /// </summary>
  [AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
  public class Command : Attribute
  {
    public string CommandName { get; set; }

    public Command(string commandName)
    {
      CommandName = commandName;
    }
  }

  /// <summary>
  /// Обработчик комманд
  /// </summary>
  public class CommandHandler
  {
    public delegate void CommandEventHandler(object sender, CommandEventArgs e);
    //public event CommandEventHandler CommandEvent;

    public CommandHandler() { }

    public CommandEventHandler GetListener()
    {
      return new CommandEventHandler(onCommandHandlerEvent);
    }

    public void onCommandHandlerEvent(object sender, CommandEventArgs e)
    {
      if (e.Cancel)
        return;

      //MethodInfo[] methods = Assembly.GetAssembly(typeof(CommandHandler)).GetTypes()
      //                .SelectMany(t => t.GetMethods())
      //                .Where(m => m.GetCustomAttributes<Command>(false).Count() > 0)
      //                .ToArray();

      MethodInfo[] methods = typeof(CommandHandler).GetMethods().Where(m => m.GetCustomAttribute<Command>(true) != null).ToArray();
      
      foreach (MethodInfo method in methods)
      {
        String methodName = method.CustomAttributes.FirstOrDefault().ConstructorArguments.FirstOrDefault().Value.ToString();
        if (methodName.Equals(e.Message.GetCommandName()))
        {
          method.Invoke(new CommandHandler(), new object[] { e.Message });
        }
      }

      e.Cancel = true;
    }

    [Command("/kick")]
    public void KickUser(Message message)
    {
      KickUser(message.GetUserName());
    }

    /// <summary>
    /// Логика кика
    /// </summary>
    /// <param name="userName"></param>
    private void KickUser(string userName)
    {

    }
  }
}