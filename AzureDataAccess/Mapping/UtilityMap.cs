using System.Data.Entity.ModelConfiguration;
using Entities;

namespace AzureDataAccess.Mapping
{
    public class UtilityMap : EntityTypeConfiguration<Utility>
    {
        public UtilityMap()
        {
            // Primary Key
            this.HasKey(t => t.UtilityID);

            // Properties
            this.Property(t => t.UtilityName)
                .IsRequired()
                .HasMaxLength(250);

            // Table & Column Mappings
            this.ToTable("Utilities");
            this.Property(t => t.UtilityID).HasColumnName("UtilityID");
            this.Property(t => t.UtilityName).HasColumnName("UtilityName");
            this.Property(t => t.KmNo).HasColumnName("KmNo");
            this.Property(t => t.MonthsNo).HasColumnName("MonthsNo");
            this.Property(t => t.Description).HasColumnName("Description");
        }
    }
}
