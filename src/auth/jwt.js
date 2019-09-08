import JwtStrategy from "passport-jwt";
import ExtractJwt from "passport-jwt";
import dotenv from "dotenv";
dotenv.config(); //.env 파일 로드

const opts = {
  jwtFromRequest: ExtractJwt.ExtractJwt.fromAuthHeaderAsBearerToken(), //BearerToken 방식으로
  secretOrKey: process.env.JWT_SECRET //보통은 process.env에 저장해서 key가 노출되지 않도록 한다.
};

export default new JwtStrategy.Strategy(opts, (jwt_payload, done) => {
  //원래는 자신의 데이터 베이스 값과 비교해야하지만 예제 편의상 리터럴로 바로사용
  // if (jwt_payload.email  = = = "1jin94@naver.com") {
  //     return done(null, true)
  // }
  return done(null, false);
});
