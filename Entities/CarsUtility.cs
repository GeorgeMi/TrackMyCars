namespace Entities
{
    public partial class CarsUtility
    {
        public int CarUtilityID { get; set; }
        public int UtilityID { get; set; }
        public int CarID { get; set; }
        public System.DateTime StartedDate { get; set; }
        public int StartedKmNo { get; set; }
        public string Description { get; set; }
        public virtual Car Car { get; set; }
        public virtual Utility Utility { get; set; }
    }
}
