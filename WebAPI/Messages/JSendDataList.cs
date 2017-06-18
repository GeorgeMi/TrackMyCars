
using System.Collections.Generic;

namespace WebAPI.Messages
{
    public class JSendDataList<T> : JSend where T : class
    {
        public IEnumerable<T> data;

        public JSendDataList(string status, IEnumerable<T> data) : base(status)
        {
            this.data = data;
        }
    }
}