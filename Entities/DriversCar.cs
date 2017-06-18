namespace Entities
{
    public partial class DriversCar
    {
        public int DriverCarID { get; set; }
        public int UserID { get; set; }
        public int CarID { get; set; }
        public virtual Car Car { get; set; }
        public virtual User User { get; set; }
    }
}
