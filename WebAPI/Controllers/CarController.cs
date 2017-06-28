/* Copyright (C) Miron George - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Miron George <george.miron2003@gmail.com>, 2016
 */

using System.Collections.Generic;
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
    public class CarController : ApiController
    {
        readonly CarModel _carModel = new CarModel();

        /// <summary>
        /// 
        /// </summary>
        [RequireToken]
        public HttpResponseMessage Get()
        {
            HttpResponseMessage responseMessage;
            JSend json;
            var list = _carModel.GetAllCars();

            if (list.Count > 0)
            {
                json = new JSendData<CarDTO>("success", list);
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
        /// 
        /// </summary>
        [RequireToken]
        [HttpGet]
        [ActionName("usercars")]
        public HttpResponseMessage Usercars(string id)
        {
            HttpResponseMessage responseMessage;
            JSend json;

            var list = _carModel.GetAllUserCars(id);

            if (list.Count > 0)
            {
                json = new JSendData<CarDTO>("success", list);
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
        /// 
        /// </summary>
        /// <param name="id"></param>
        [RequireToken]
        [HttpGet]
        [ActionName("getCar")]
        public HttpResponseMessage GetCar(int id)
        {
            HttpResponseMessage responseMessage;
            JSend json;
            var carDetails = _carModel.GetCarDetails(id);

            if (null != carDetails)
            {
                json = new JSendData<CarDetailsDTO>("success", new List<CarDetailsDTO> {carDetails});
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
        /// <param name="carDetailsDto"></param>
        /// <returns>http status code OK sau ExpectationFailed</returns>
        [RequireAdminToken]
        public HttpResponseMessage Post(CarDetailsDTO carDetailsDto)
        {
            HttpResponseMessage responseMessage;
            JSendMessage json;
            var response = _carModel.AddCar(carDetailsDto);

            if (response)
            {
                json = new JSendMessage("success", "Car successfully added");
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
        /// <param name="carDto"></param>
        /// <returns>http status code OK sau ExpectationFailed</returns>
        [RequireAdminToken]
        public HttpResponseMessage Put(CarDetailsDTO carDto)
        {

            HttpResponseMessage responseMessage;
            JSendMessage json;

            var response = _carModel.UpdateCar(carDto);

            if (response)
            {
                json = new JSendMessage("success", "Car details successfully updated");
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
            var response = _carModel.DeleteCar(id);

            if (response)
            {
                json = new JSendMessage("success", "Car successfully deleted");
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
