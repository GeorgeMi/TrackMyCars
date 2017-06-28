using System.Collections.Generic;

namespace DataTransferObject
{
    public class CarDTO
    {
        public int CarID { get; set; }
        public string RegNo { get; set; }
        public int Year { get; set; }
        public int KmNo { get; set; }
        public string Brand { get; set; }
        public string Driver { get; set; }
        public List<CarUtilityDetailsDTO> Utilities { get; set; }
    }
}
