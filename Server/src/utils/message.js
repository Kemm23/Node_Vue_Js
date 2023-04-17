import { SUCCESS, ERROR } from "@/constants/common"

let haveIt = [];

function generateUniqueRandom(maxNr) {
    let random = (Math.random() * maxNr).toFixed();

    random = Number(random);

    if(!haveIt.includes(random)) {
        haveIt.push(random);
        return random;
    } else {
        if(haveIt.length < maxNr) {
         return  generateUniqueRandom(maxNr);
        } else {
          console.log('No more errorCode available.')
          return false;
        }
    }
}
//Data can be a data or error message
let messageResponse = (type, data = null) => {
    switch(type) {
        case SUCCESS:
            return {
                message: 1,
                data: data
            }
        case ERROR:
            return {
                message: 0,
                errors: {
                    errCode: `E${generateUniqueRandom(1000)}`,
                    errMsg: data
                }
            }
        default:
            return {
                messageError: 'Type message response error is invalid'
            }
    }
}

export default messageResponse