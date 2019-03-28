const express = require('express');
const router = express.Router();
const moment = require('moment')
const CMData = require('../model/cmdata')

router.get('/',(req,res)=>{
    CMData.find()
        .exec()
        .then(docs=>{
            return res.render('data',{data:docs})
        })
        .catch(err=>{
            return res.status(500).json({
                error:err
            })
        })
})

router.get('/:device_id',(req,res)=>{
    const device_id=req.params.device_id

    const date = req.query.date
    const date_range = req.query.date_range

    if(date){
        if(date=='today'){
            const startTime = moment().startOf('day')
            const endTime = moment(startTime).endOf('day')
            startTime.add({hours:6})
            endTime.add({hours:6})

            console.log(startTime,endTime)
            CMData.find({
                device_id:device_id,
                date:{
                    $gte: startTime.toDate(),
                    $lte: endTime.toDate()
                }
            })
            .exec()
            .then(docs=>{
                return res.status(200).render('data',{data:docs})
            })
            .catch(err=>{
                return res.status(500).json({
                    error:err
                })
            })
        }else{
            const castDate = new Date(date);
            
            if(isValidDate(castDate)){
                console.log(castDate)
                const startTime = moment(castDate)
                const endTime = moment(startTime).endOf('day')

                startTime.add({hours:6})
                endTime.add({hours:6})
                console.log(startTime,endTime)

                CMData.find({
                    device_id:device_id,
                    date:{
                        $gte: startTime.toDate(),
                        $lte: endTime.toDate()
                    }
                })
                .exec()
                .then(docs=>{
                    return res.status(200).render('data',{data:docs})
                })
                .catch(err=>{
                    return res.status(500).json({
                        error:err
                    })
                })
            }else{
                return res.status(500)
                    .json({
                        message:"Failed to Cast Date"
                    })
            }

        }
    }else if(date_range){
        const dates = date_range.split('-')
        if(dates.length==2){
            firstDateStr = dates[0]
            secondDateStr = dates[1]

            console.log(firstDateStr,secondDateStr)

            const castFirstDate = new Date(firstDateStr);
            const castSecondDate = new Date(secondDateStr);

            if(isValidDate(castFirstDate) && isValidDate(castSecondDate)){
                const startTime = moment(castFirstDate)
                const lastDateStartTime = moment(castSecondDate)
                const lastDateEndTime = moment(lastDateStartTime).endOf('day')
                lastDateEndTime.add({hours:6})
                startTime.add({hours:6})

                console.log(startTime,lastDateEndTime)

                CMData.find({
                    device_id:device_id,
                    date:{
                        $gte: startTime.toDate(),
                        $lte: lastDateEndTime.toDate()
                    }
                })
                .exec()
                .then(docs=>{
                    return res.status(200).render('data',{data:docs})
                })
                .catch(err=>{
                    return res.status(500).json({
                        error:err
                    })
                })



            }else{
                return res.status(500)
                    .json({
                        message:"Failed to Cast Date"
                    })
            }

        }else{
            return res.status(500).json({
                message:"Date Format (YYYY/MM/DD) and separate by - "
            })
        }
    }else{

        CMData.find({device_id:device_id})
        .exec()
        .then(docs=>{
            return res.status(200).render('data',{data:docs})
        })
        .catch(err=>{
            return res.status(500).json({
                error:err
            })
        })

    }
})

router.get('/:device_id/last_data',(req,res)=>{
    const device_id=req.params.device_id

    var docs =[]

    CMData.findOne({device_id:device_id})
    .sort({date:-1})
    .exec()
    .then(doc=>{
        docs.push(doc)
        return res.status(200).render('data',{data:docs})
    })
    .catch(err=>{
        return res.status(500).json({
            error:err
        })
    })
})


function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}


module.exports =router