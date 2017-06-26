using AzureDataAccess;
using DataTransferObject;
using Entities;
using System.Collections.Generic;
using System.Linq;

namespace BusinessLogic
{
    /// <summary>
    /// 
    /// </summary>
    public class UtilityLogic
    {
        private readonly IAzureDataAccess _dataAccess;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objDataAccess"></param>
        public UtilityLogic(IAzureDataAccess objDataAccess)
        {
            // Primesc obiectul, nu e treaba CategoryLogic ce dataAccess se foloseste
            // Unity are grija de dependency injection
            _dataAccess = objDataAccess;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public List<UtilityDTO> GetAllUtilities()
        {
            var listUtilities = _dataAccess.UtilityRepository.GetAll().ToList();

            return listUtilities.Select(u => new UtilityDTO
            {
                UtilityID = u.UtilityID,
                Description = u.Description,
                KmNo = u.KmNo,
                MonthsNo = u.MonthsNo,
                UtilityName = u.UtilityName
            }).ToList();
        }

        /// <summary>
        /// </summary>
        /// <param name="utilityDto"></param>
        public void AddUtility(UtilityDTO utilityDto)
        {
            var utility = new Utility
            {
                Description = utilityDto.Description,
                KmNo = utilityDto.KmNo,
                MonthsNo = utilityDto.MonthsNo,
                UtilityName = utilityDto.UtilityName
            };

            _dataAccess.UtilityRepository.Add(utility);
        }

        /// <summary>
        /// </summary>
        /// <param name="utilityId"></param>
        public void DeleteUtility(int utilityId)
        {
            var utility = _dataAccess.UtilityRepository.FindFirstBy(u => u.UtilityID == utilityId);
            _dataAccess.UtilityRepository.Delete(utility);
        }
    }
}
