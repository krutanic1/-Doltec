require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL)
.then(async () => {
  const CompanyPostedJob = require('./models/CompanyPostedJob');
  const jobs = await CompanyPostedJob.find().sort({_id:-1}).limit(2).lean();
  console.log(JSON.stringify(jobs, null, 2));
  
  const agg = await CompanyPostedJob.aggregate([
      {
        $lookup: {
          from: 'companyusers',
          localField: 'companyId',
          foreignField: 'companyId',
          as: 'company',
        },
      },
      {
        $unwind: {
          path: '$company',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          companyName: { $ifNull: ['$company.companyName', '$companyId'] },
          jobTitle: 1,
        }
      }
    ]).sort({ _id: -1 }).limit(2);
    console.log('AGG:', JSON.stringify(agg, null, 2));

  process.exit(0);
});
