using System.Collections.Generic;

namespace WebAPI.Messages
{
    public class JSendData<T> : JSend where T : class
    {
        public List<T> data;

        public JSendData(string status, List<T> data) : base(status)
        {
            this.data = data;
        }
    }
}