using System;

namespace DataTransferObject
{
    public class CarUtilityDetailsDTO
    {
        public string UtilityName { get; set; }
        public int ExpirationDate { get; set; }
        public int ExpirationKmNo { get; set; }
        public string Description { get; set; }
    }
}
