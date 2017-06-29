/* Copyright (C) Miron George - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Miron George <george.miron2003@gmail.com>, 2016
 */
using DataTransferObject;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebAPI.ActionFilters;
using WebAPI.Messages;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    /// <summary>
    /// Gestionare cereri HTTP pentru contactare
    /// </summary>
    public class ContactController : ApiController
    {
        readonly ContactModel _contactModel = new ContactModel();

        /// <summary>
        /// Primire mesaj de la utilizator si trimitere catre admin
        /// </summary>
        /// <param name="contactMessageDto">detaliile mesajului</param>
        /// <returns>http status code OK sau ExpectationFailed</returns>
        [RequireToken]
        public HttpResponseMessage Post(ContactMessageDTO contactMessageDto)
        {
            HttpResponseMessage responseMessage;
            JSendMessage json;
           
            // Preluare token pentru a identifica utilizatorul
            var token = Request.Headers.SingleOrDefault(x => x.Key == "token").Value.First();
            var response = _contactModel.SendMessage(token, contactMessageDto);


            if (response)
            {
                json = new JSendMessage("success", "Message sent successfully");
                responseMessage = Request.CreateResponse(HttpStatusCode.OK, json);
            }
            else
            {
                json = new JSendMessage("fail", "Something bad happened");
                responseMessage = Request.CreateResponse(HttpStatusCode.BadRequest, json);
            }

            return responseMessage;
        }

        [RequireToken]
        [HttpGet]
        [ActionName("updateusers")]
        public HttpResponseMessage UpdateUsers()
        {
            HttpResponseMessage responseMessage;
            JSendMessage json;
            var response = _contactModel.UpdateUsers();

            if (response)
            {
                json = new JSendMessage("success", "Message sent successfully");
                responseMessage = Request.CreateResponse(HttpStatusCode.OK, json);
            }
            else
            {
                json = new JSendMessage("fail", "Something bad happened");
                responseMessage = Request.CreateResponse(HttpStatusCode.BadRequest, json);
            }

            return responseMessage;
        }
    }
}
