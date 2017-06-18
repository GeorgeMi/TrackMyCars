/* Copyright (C) Miron George - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Miron George <george.miron2003@gmail.com>, 2016
 */
using DataTransferObject;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebAPI.Messages;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    /// <summary>
    /// Gestionare cereri HTTP pentru inregistrare
    /// </summary>
    public class RegistrationController : ApiController
    {
        /// <summary>
        /// Primeste delatiile utilizatorului, verificare unicitate si adaugare utilizator
        /// </summary>
        /// <param name="user">delatiile utilizatorului</param>
        /// <returns></returns>
        public HttpResponseMessage Post(UserRegistrationDTO user)
        {
            var userModel = new UsersModel();
            HttpResponseMessage response;
            JSendMessage json;
            var add = userModel.AddUser(user);

            if (add)
            {
                json = new JSendMessage("success", "Registration successful! Please, verify your mail address.");
                response = Request.CreateResponse(HttpStatusCode.OK, json);
            }
            else
            {
                json = new JSendMessage("failed", "Registration failed! Please, try another username or email.");
                response = Request.CreateResponse(HttpStatusCode.Forbidden, json);
            }

            return response;
        }

        /// <summary>
        /// Primire token trimis in mail si activare cont
        /// </summary>
        /// <param name="id">token</param>
        /// <returns>success message sau error message </returns>
        public HttpResponseMessage Get(string id)
        {
            var auth = new AuthModel();
            var verify = auth.VerifyMailToken(id);
            HttpResponseMessage response;
            JSendMessage json;

            if (verify)
            {
                json = new JSendMessage("success", "Your account has been successfully verified");
                response = Request.CreateResponse(HttpStatusCode.OK, json);
            }
            else
            {
                json = new JSendMessage("failed", "Invalid verification link");
                response = Request.CreateResponse(HttpStatusCode.Forbidden, json);
            }

            return response;
        }
    }
}
