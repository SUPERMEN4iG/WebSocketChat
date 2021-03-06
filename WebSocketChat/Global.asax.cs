﻿namespace WebSocketChat
{
  using System;
  using System.Collections.Generic;
  using System.Linq;
  using System.Web;
  using System.Web.Mvc;
  using System.Web.Optimization;
  using System.Web.Routing;
  using WebSocketChat.Lib.Server;

    public class Global : System.Web.HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
          AreaRegistration.RegisterAllAreas();
          FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
          RouteConfig.RegisterRoutes(RouteTable.Routes);
          BundleConfig.RegisterBundles(BundleTable.Bundles);

          Room newRoom = new Room();
          newRoom.CreateRoom();

          new CleanThreadFactory();
        }

        protected void Application_End(object sender, EventArgs e)
        {
        }
    }
}