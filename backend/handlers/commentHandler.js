const { comments } = require('../schemas')

const comment = {
    getParticularPostComments: async (req, res) => {
        let postId = req.query.postId
        let index = parseInt(req.query.index)
        let size = parseInt(req.query.size)
        let lastDocument = false
        index = index * size
        let commentLength  = await (await comments.find({postId: postId})).length
        if(index+size >= commentLength){
            console.log(`comment length ${commentLength} index ${index}`)
            lastDocument = true
        }
        let commentData = await comments.aggregate([
            { $match: {postId: postId} },
            { $project: {'createdBy':1,'text':1} },
            {
                "$lookup":{
                    "let": { "userObjId": { "$toObjectId": "$createdBy" } },
                    "from":"users",
                    "pipeline":[
                        { "$match": { "$expr": { "$eq": ["$_id","$$userObjId"] } } }
                    ],
                    "as":"user"
                },
            },
            { "$unwind":"$user" },
            { "$project":{ 'user.firstName':1,'user.lastName':1,'user.profileImage':1,'text':1 } }
        ]).skip(index).limit(size)
        res.status(200).send({commentData: commentData, lastDocument: lastDocument})
    },

    saveNewPostComment: async (req, res) => {
        let arr = []
        req.body.createdBy = req.user._id
        let commentObject = new comments(req.body)
        await commentObject.save(async (err, comment) => {
            if (err) {
                let error = Object.values(err.errors)[0].message
                res.status(200).json({ status: 400, msg: error })
            }
            else {
                arr.push(comment)
                let commentData = await comments.find({ postId: req.body.postId })
                res.status(200).json({ data: arr, length: commentData.length })
            }
        })
    },

    deletePostComment: async (req,res)=>{
        const deleteCommentStatus = await comments.findByIdAndDelete(req.params.id)
        res.status(200).json({ status: 200, msg: 'message deleted', data: deleteCommentStatus })
    }
}

module.exports = comment