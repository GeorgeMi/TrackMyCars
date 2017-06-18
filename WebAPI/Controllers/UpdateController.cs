/* Copyright (C) Miron George - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Miron George <george.miron2003@gmail.com>, 2016
 */
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebAPI.ActionFilters;
using WebAPI.Messages;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    /// <summary>
    /// Gestionare cereri HTTP pentru actualizare conturi si sondaje
    /// </summary>
    public class UpdateController : ApiController
    {
        /// <summary>
        /// delete unverified accounts and set to closed outdated forms
        /// </summary>
       [RequirePasswordForScheduler]
        public HttpResponseMessage Get()
        {
            var model = new UsersModel();

            model.ScheduleUpdates();
            JSend json = new JSendMessage("success", "Database successfully updated");
            var responseMessage = Request.CreateResponse(HttpStatusCode.OK, json);

            return responseMessage;
        }
    }
}