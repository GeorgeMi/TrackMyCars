using System.Collections.Generic;

namespace Entities
{
    public partial class Car
    {
        public Car()
        {
            this.CarsUtilities = new List<CarsUtility>();
            this.DriversCars = new List<DriversCar>();
        }

        public int CarID { get; set; }
        public string RegNo { get; set; }
        public int Year { get; set; }
        public int KmNo { get; set; }
        public string Brand { get; set; }
        public virtual ICollection<CarsUtility> CarsUtilities { get; set; }
        public virtual ICollection<DriversCar> DriversCars { get; set; }
    }
}
