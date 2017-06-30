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
    /// Gestionare cereri HTTP pentru utilizatori
    /// </summary>
    public class UserController : ApiController
    {
        readonly UsersModel _userModel = new UsersModel();

        /// <summary>
        /// Returnarea listei tuturor utilizatorilor
        /// </summary>
        [RequireAdminToken]
        public HttpResponseMessage Get()
        {
            HttpResponseMessage responseMessage;
            JSend json;
            var pageVal = GetPageNumberAndElementNumber();
            var pageNr = pageVal[0];
            var perPage = pageVal[1];
            var list = _userModel.GetAllUsers(pageNr, perPage);

            if (list.Count > 0)
            {
                json = new JSendData<UserDetailDTO>("success", list);
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
        /// Returnarea listei tuturor numelor si id-urilor utilizatorilor
        /// </summary>
        [RequireAdminToken]
        [HttpGet]
        [ActionName("usernames")]
        public HttpResponseMessage Usernames(int id)
        {
            HttpResponseMessage responseMessage;
            JSend json;
            var list = _userModel.GetAllUsernames();

            if (list.Count > 0)
            {
                json = new JSendData<UsernameDTO>("success", list);
                responseMessage = Request.CreateResponse(HttpStatusCode.OK, json);
            }
            else
            {
                json = new JSendMessage("fail", "No items found");
                responseMessage = Request.CreateResponse(HttpStatusCode.NoContent, json);
            }

            return responseMessage;
        }

        /// <summary>
        /// Returnarea detaliilor unui utilizator
        /// </summary>
        /// <param name="id">user ID</param>
        [RequireToken]
        public HttpResponseMessage Get(int id)
        {
            HttpResponseMessage responseMessage;
            var userDetail = _userModel.GetUser(id);

            if (userDetail != null)
            {
                responseMessage = Request.CreateResponse(HttpStatusCode.OK, userDetail);
            }
            else
            {
                var json = new JSendMessage("fail", "No items found");
                responseMessage = Request.CreateResponse(HttpStatusCode.NoContent, json);
            }

            return responseMessage;
        }

        /// <summary>
        /// Stergerea unui utilizator
        /// </summary>
        /// <param name="id">user ID</param>
        /// <returns>http status code OK or ExpectationFailed</returns>
        [RequireAdminToken]
        public HttpResponseMessage Delete(int id)
        {
            HttpResponseMessage responseMessage;
            JSendMessage json;

            var response = _userModel.Delete(id);
            if (response)
            {
                json = new JSendMessage("success", "User successfully deleted");
                responseMessage = Request.CreateResponse(HttpStatusCode.OK, json);
            }
            else
            {
                json = new JSendMessage("fail", "Selected user cannot be deleted");
                responseMessage = Request.CreateResponse(HttpStatusCode.BadRequest, json);
            }

            return responseMessage;
        }

        /// <summary>
        /// Promovarea unui utilizator
        /// </summary>
        /// <param name="id">user ID</param>
        /// <returns>http status code OK sau ExpectationFailed</returns>
        [RequireAdminToken]
        [HttpGet]
        [ActionName("promote")]
        public HttpResponseMessage Promote(int id)
        {
            HttpResponseMessage responseMessage;
            JSendMessage json;
            var response = _userModel.PromoteUser(id);

            if (response)
            {
                json = new JSendMessage("success", "User successfully promoted");
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
        /// Schimbarea rolului unui utilizator
        /// </summary>
        /// <param name="id">user ID</param>
        /// <returns>http status code OK sau ExpectationFailed</returns>
        [RequireAdminToken]
        [HttpGet]
        [ActionName("demote")]
        public HttpResponseMessage Demote(int id)
        {
            HttpResponseMessage responseMessage;
            JSendMessage json;
            var response = _userModel.DemoteUser(id);

            if (response)
            {
                json = new JSendMessage("success", "User successfully demoted");
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
    }
}
