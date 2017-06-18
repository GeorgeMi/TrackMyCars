using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using WebAPI.Messages;

namespace WebAPI.ActionFilters
{
    public class RequirePasswordForScheduler : ActionFilterAttribute
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public override void OnActionExecuting(HttpActionContext context)
        {
            var header = context.Request.Headers.SingleOrDefault(x => x.Key == "scheduler");
            var valid = false;

            if (header.Value != null)
            {
                if (header.Value.ToArray()[0].Equals("pollWebApi123"))
                {
                    valid = true;
                }
            }

            if (!valid)
            {
                // Token invalid 
                var json = new JSendMessage("fail", "Invalid Authorization Key");
                context.Response = context.Request.CreateResponse(HttpStatusCode.Forbidden, json);
            }
        }
    }
}