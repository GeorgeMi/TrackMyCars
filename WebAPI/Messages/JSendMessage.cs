namespace WebAPI.Messages
{
    public class JSendMessage : JSend
    {
         public string message;
       
        public JSendMessage(string status, string message): base(status)
        {
            this.message = message;
        }
    }
}