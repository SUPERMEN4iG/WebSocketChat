using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebSocketChat.Lib.Extensions
{
    [Serializable]
  public class ApplicationException : System.Exception
  {
    public ApplicationException() : base() { }
    public ApplicationException(string message) : base(message) { }
    public ApplicationException(string message, System.Exception ex) : base(message, ex) { }
  }

    [Serializable]
  public class ApplicationException__ArgumentNullException : ApplicationException
  {
    public ApplicationException__ArgumentNullException() : base() { }
    /// <summary>
    /// Исключение на null-тип аргумент
    /// </summary>
    /// <param name="argumentValue">Аргумент</param>
    public ApplicationException__ArgumentNullException(string argumentValue) : base(String.Format("Argument ({0}){1} is null", argumentValue.GetType().ToString(), argumentValue)) { }
    public ApplicationException__ArgumentNullException(string argumentValue, System.Exception ex) : base(String.Format("Argument ({0}){1} is null", argumentValue.GetType().ToString(), argumentValue), ex) { }
  }

    [Serializable]
  public class ApplicationException__ArgumentIsNotValid : ApplicationException
  {
    public ApplicationException__ArgumentIsNotValid() : base() { }

    public ApplicationException__ArgumentIsNotValid(string argumentValue) : base(String.Format("Argument ({0}){1} is not valid", argumentValue.GetType().ToString(), argumentValue)) { }

    public ApplicationException__ArgumentIsNotValid(string argumentValue, System.Exception ex) : base(String.Format("Argument ({0}){1} is not valid", argumentValue.GetType().ToString(), argumentValue)) { }
  }
}