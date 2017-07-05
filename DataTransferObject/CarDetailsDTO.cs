using System.Collections.Generic;

namespace DataTransferObject
{
    public class CarDetailsDTO
    {
        public int CarID { get; set; }
        public string RegNo { get; set; }
        public int Year { get; set; }
        public int KmNo { get; set; }
        public string Brand { get; set; }
        public List<UtilityCarDTO> Utilities { get; set; }
        public List<int> UtilitiesIDs { get; set; }
        public int DriverID { get; set; }
    }
}
