using System;

namespace DataTransferObject
{
    public class UtilityDTO
    {
        public int UtilityID { get; set; }
        public string UtilityName { get; set; }
        public int? KmNo { get; set; }
        public int? MonthsNo { get; set; }
        public DateTime? Description { get; set; }
    }
}
