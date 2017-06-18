using System.Collections.Generic;

namespace Entities
{
    public partial class User
    {
        public User()
        {
            this.DriversCars = new List<DriversCar>();
            this.Tokens = new List<Token>();
        }

        public int UserID { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string Verified { get; set; }
        public virtual ICollection<DriversCar> DriversCars { get; set; }
        public virtual ICollection<Token> Tokens { get; set; }
    }
}
