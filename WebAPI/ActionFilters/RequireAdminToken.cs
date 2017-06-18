using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using WebAPI.Messages;
using WebAPI.Models;

namespace WebAPI.ActionFilters
{
    public class RequireAdminToken : ActionFilterAttribute
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public override void OnActionExecuting(HttpActionContext context)
        {
            var authModel = new AuthModel();
            var header = context.Request.Headers.SingleOrDefault(x => x.Key == "token");

            bool valid;

            if (header.Value == null)
            {
                valid = false;
            }
            else
            {
                // Tokenul apartine unui admin
                var isAdmin = authModel.VerifyAdminToken(header.Value.First());

                // Tokenul este valid
                var okDate = authModel.VerifyToken(header.Value.First());

                valid = isAdmin && okDate;
            }

            if (!valid)
            {
                var json = new JSendMessage("fail", "Invalid Authorization Key");
                context.Response = context.Request.CreateResponse(HttpStatusCode.Forbidden, json);
            }
        }
    }
}