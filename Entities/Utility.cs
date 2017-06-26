using System;
using System.Collections.Generic;

namespace Entities
{
    public partial class Utility
    {
        public Utility()
        {
            this.CarsUtilities = new List<CarsUtility>();
        }

        public int UtilityID { get; set; }
        public string UtilityName { get; set; }
        public int? KmNo { get; set; }
        public int? MonthsNo { get; set; }
        public string Description { get; set; }
        public virtual ICollection<CarsUtility> CarsUtilities { get; set; }
    }
}
