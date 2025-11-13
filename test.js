import { OsuAPIRequestBuilder } from "@rian8337/osu-base";
import { AttributesCalculator, DroidBanchoUser } from "./dist/index.js"
OsuAPIRequestBuilder.setAPIKey(process.env.OSU_API_KEY)
const a = async () => {
    const user = await DroidBanchoUser.get({ uid: 177955 });

    const recent = await user.getRecentScores();
    const data = await recent[0].calculate("droid");
    const attr = AttributesCalculator.calculate(recent[0]);
    console.log(attr);
    // console.log(data);
    
}

a()