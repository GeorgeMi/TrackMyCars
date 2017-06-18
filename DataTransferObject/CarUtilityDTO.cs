using System;

namespace DataTransferObject
{
    public class CarUtilityDTO
    {
        public int CarUtilityID { get; set; }
        public int UtilityID { get; set; }
        public int CarID { get; set; }
        public DateTime StartedDate { get; set; }
        public int StartedKmNo { get; set; }
        public string Description { get; set; }
    }
}
