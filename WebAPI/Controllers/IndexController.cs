/* Copyright (C) Miron George - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Miron George <george.miron2003@gmail.com>, 2016
 */

using System.Linq;
using System.Web.Http;
using WebAPI.ActionFilters;
using WebAPI.Messages;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    /// <summary>
    /// Gestionare cereri HTTP pentru index
    /// </summary>
    public class IndexController:ApiController
    {
        /// <summary>
        /// Primire token si returnare rol user
        /// </summary>
        /// <returns>string: user sau admin</returns>
        [RequireToken]
        public RoleMessage Get()
        {
            var authModel = new AuthModel();

            var header = Request.Headers.SingleOrDefault(x => x.Key == "token");
            var isAdmin = authModel.VerifyAdminToken(header.Value.First());
            RoleMessage msg;

            if (isAdmin)
            {
                msg = new RoleMessage("admin");
                return msg;
            }
            else
            {
                msg = new RoleMessage("user");
                return msg;
            }
        }
    }
}