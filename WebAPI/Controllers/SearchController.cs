/* Copyright (C) Miron George - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Miron George <george.miron2003@gmail.com>, 2016
 */
using DataTransferObject;
using System;
using System.Collections.Generic;
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
    /// 
    /// </summary>
    public class SearchController: ApiController
    {
        UtilityModel _carsUtilitiesModel = new UtilityModel();

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        [RequireToken]
        public HttpResponseMessage Get(string id)
        {
            HttpResponseMessage responseMessage;
            JSend json;
            var token = Request.Headers.SingleOrDefault(x => x.Key == "token").Value.First();
            var pageVal = GetPageNumberAndElementNumber();
            var pageNr = pageVal[0];
            var perPage = pageVal[1];
            var state = GetState();

            var list = new List<UtilityDTO>();
            list = _carsUtilitiesModel.GetAllUtilities();

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
        /// parse query from request and get page number and number of elements per page
        /// </summary>
        /// <returns>page number and number of elements per page</returns>
        private int[] GetPageNumberAndElementNumber()
        {
            var result = new int[2];
            int pageNr = 0, perPage = 10;
            try
            {
                //if query exists and it is valid, default page number and number of elements per page values are changing 
                var queryString = Request.GetQueryNameValuePairs();

                foreach (var pair in queryString)
                {
                    if (pair.Key == "page")
                    {
                        pageNr = int.Parse(pair.Value);
                    }
                    if (pair.Key == "per_page")
                    {
                        perPage = int.Parse(pair.Value);
                    }
                }

                if (pageNr < 0 || perPage < 0)
                {
                    pageNr = 0;
                    perPage = 10;
                }
            }
            catch
            {
                pageNr = 0;
                perPage = 10;
            }

            result[0] = pageNr;
            result[1] = perPage;

            return result;
        }

        private string GetState()
        {
            var state = "open";

            try
            {
                //if query exists and it is valid, default state value is changing 
                var queryString = Request.GetQueryNameValuePairs();

                foreach (var pair in queryString)
                {
                    if (pair.Key == "state")
                    {
                        state = pair.Value;
                    }
                }

                if (state != "open" && state != "closed" && state != "all")
                {
                    state = "open";
                }
            }
            catch
            {
                state = "open";
            }

            return state;
        }
    }
}