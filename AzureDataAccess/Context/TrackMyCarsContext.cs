using System.Data.Entity;
using AzureDataAccess.Mapping;
using Entities;

namespace AzureDataAccess.Context
{
    public partial class TrackMyCarsContext : DbContext
    {
        static TrackMyCarsContext()
        {
            Database.SetInitializer<TrackMyCarsContext>(null);
        }

        public TrackMyCarsContext()
            : base("Name=TrackMyCarsContext")
        {
        }

        public DbSet<Car> Cars { get; set; }
        public DbSet<CarsUtility> CarsUtilities { get; set; }
        public DbSet<DriversCar> DriversCars { get; set; }
        public DbSet<sysdiagram> sysdiagrams { get; set; }
        public DbSet<Token> Tokens { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Utility> Utilities { get; set; }
        public DbSet<database_firewall_rules> database_firewall_rules { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new CarMap());
            modelBuilder.Configurations.Add(new CarsUtilityMap());
            modelBuilder.Configurations.Add(new DriversCarMap());
            modelBuilder.Configurations.Add(new sysdiagramMap());
            modelBuilder.Configurations.Add(new TokenMap());
            modelBuilder.Configurations.Add(new UserMap());
            modelBuilder.Configurations.Add(new UtilityMap());
            modelBuilder.Configurations.Add(new database_firewall_rulesMap());
        }
    }
}
