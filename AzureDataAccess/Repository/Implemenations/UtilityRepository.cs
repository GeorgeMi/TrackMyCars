﻿/* Copyright (C) Miron George - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Miron George <george.miron2003@gmail.com>, 2016
 *
 * Role:
 * Repository implementation. 
 *
 * History:
 * 09.02.2016    Miron George       Created class.
 */

using AzureDataAccess.Context;
using AzureDataAccess.Repository.Interfaces;
using Entities;

namespace AzureDataAccess.Repository.Implemenations
{
    public class UtilityRepository : GenericRepository<Utility>, IUtilityRepository
    {
        public UtilityRepository(TrackMyCarsContext context) : base(context)
        {
        }
    }
}

