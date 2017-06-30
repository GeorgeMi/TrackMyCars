/* Copyright (C) Miron George - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Miron George <george.miron2003@gmail.com>, 2016
 */

using System;
using DataTransferObject;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebAPI.ActionFilters;
using WebAPI.Messages;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    public class UtilityController : ApiController
    {
        readonly UtilityModel _utilityModel = new UtilityModel();

        /// <summary>
        /// 
        /// </summary>
        [RequireToken]
        public HttpResponseMessage Get(int? id = null)
        {
            HttpResponseMessage responseMessage;
            JSend json;
            var list = _utilityModel.GetAllUtilities(id);

            if (list.Count > 0)
            {
                json = new JSendData<UtilityDTO>("success", list);
                responseMessage = Request.CreateResponse(HttpStatusCode.OK, json);
            }
            else
            {
                json = new JSendMessage("fail", "No items found");
                responseMessage = Request.CreateResponse(HttpStatusCode.NotFound, json);
            }

            return responseMessage;
        }

        /// <summary>
        /// </summary>
        /// <param name="utilityDto"></param>
        /// <returns>http status code OK sau ExpectationFailed</returns>
        [RequireAdminToken]
        public HttpResponseMessage Post(UtilityDTO utilityDto)
        {
            HttpResponseMessage responseMessage;
            JSendMessage json;
            var response = _utilityModel.AddUtility(utilityDto);

            if (response)
            {
                json = new JSendMessage("success", "Utility successfully added");
                responseMessage = Request.CreateResponse(HttpStatusCode.OK, json);
            }
            else
            {
                json = new JSendMessage("fail", "Something bad happened");
                responseMessage = Request.CreateResponse(HttpStatusCode.BadRequest, json);
            }

            return responseMessage;
        }

        /// <summary>
        /// </summary>
        /// <param name="utilityDto"></param>
        /// <returns>http status code OK sau ExpectationFailed</returns>
        [RequireAdminToken]
        public HttpResponseMessage Put(UtilityDTO utilityDto)
        {
            HttpResponseMessage responseMessage;
            JSendMessage json;
            var response = _utilityModel.UpdateUtility(utilityDto);

            if (response)
            {
                json = new JSendMessage("success", "Utility details successfully updated");
                responseMessage = Request.CreateResponse(HttpStatusCode.OK, json);
            }
            else
            {
                json = new JSendMessage("fail", "Something bad happened");
                responseMessage = Request.CreateResponse(HttpStatusCode.BadRequest, json);
            }

            return responseMessage;
        }

        /// <summary>
        /// Stergerea unei categorii
        /// </summary>
        /// <param name="id"></param>
        /// <returns>http status code OK sau ExpectationFailed</returns>
        [RequireAdminToken]
        public HttpResponseMessage Delete(int id)
        {
            HttpResponseMessage responseMessage;
            JSendMessage json;
            var response = _utilityModel.DeleteUtility(id);

            if (response)
            {
                json = new JSendMessage("success", "Utility successfully deleted");
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
