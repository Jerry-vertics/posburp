const express =require('express');
const router =express.Router();

const {getposCategory,
    getPosWaiter,
    getCustomer,
    getTable,
    getDelivery,
    getposFooditems,
    insertPos,
    updatePayment,
    insertPoshold,
    getHold,
    todayOrder,
    insertQuickpay,
    tableorder,
    calculateTable,
    getorders,
    updateTable
} =require('../controller/posController');

const {updatePosorder} =require('../controller/posUpdateController')
const {getAllPos,completePaymeny,paidorders,cancelorders,runningorders} =require('../controller/posneworderController')
const {runningOrder,getKot,getedit,getSplit,getMerge,updateSplit} =require('../controller/posrunningorderController')
const {todayDelivery} =require('../controller/posdeliveryController')
const {posinvoiceReport} =require('../controller/posinvoiceReportController')
const {closingbalance,closeShift,getShiftAccess,closingCancelOrder,posclosingbalance} = require('../controller/closingbalanceController');
const {getCancel,updateCancel} =require('../controller/cancelOrderController');

router.get('/poscategory',getposCategory);
router.get('/posWaiter',getPosWaiter);
router.get('/posCustomer',getCustomer);
router.get('/posTable',getTable);
router.get('/posDelivery',getDelivery);
router.get('/posfood',getposFooditems);
router.post('/createpos',insertPos);
router.get('/getPos',getAllPos);
router.get('/getrunningorder',runningOrder);
router.get('/getcomplete/:id',completePaymeny);
router.put('/updatePayment/:id',updatePayment);
router.put('/updateTable/:id',updateTable)
router.get('/getKot/:id',getKot);
router.post('/createHold',insertPoshold);
router.get('/gethold',getHold);
router.get('/gettodayOrder',todayOrder);
router.post('/createQuickpay',insertQuickpay);
router.get('/getsplit/:id',getSplit);
router.post('/getmerge',getMerge);
router.get('/getEdit/:id',getedit);
router.get('/tableorder',tableorder);
router.get('/calculate',calculateTable);
router.put('/updatepos/:id',updatePosorder);
router.get('/gettodaydelivery',todayDelivery);
router.get('/invoicereport',posinvoiceReport);
router.get('/closingBalance',closingbalance)
router.put('/closeShift',closeShift);
router.get('/getOrders/:id',getorders);
router.get('/getShiftAccess',getShiftAccess);
router.get('/getCancel/:id',getCancel);
router.put('/updateCancel/:id',updateCancel);
router.get('/closingCancelOrder',closingCancelOrder);
router.get('/paidorders',paidorders);
router.get('/cancelorders',cancelorders);
router.get('/runningorders',runningorders);
router.get('/posclosingbalance',posclosingbalance);
router.put('/updateSplits/:id',updateSplit);



module.exports =router;