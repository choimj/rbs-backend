import { GraphQLServer } from "graphql-yoga";
import schema from "./schema";
import GoogleStrategy from "./auth/googleOauth";
import JwtStrategy from "./auth/jwt";
import jwt from "jsonwebtoken";
import passport from "passport";
import bodyParser from "body-parser";

import dotenv from "dotenv";
dotenv.config(); //.env 파일 로드

const logger = require("morgan");

const PORT = process.env.PORT || 4000;
const server = new GraphQLServer({ schema });
const jwtSecret = process.env.JWT_SECRET;

// server.express.use(cors());
server.express.use(bodyParser.urlencoded({ extended: false }));
server.express.use(bodyParser.json());

// server.express.set("JWT_SECRET", process.env.JWT_SECRET);

server.express.use(passport.initialize()); // passport 구동
server.express.use(passport.session()); // 세션 연결

let allowCrossDomain = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
};
server.express.use(allowCrossDomain);

// server.express.get("/", (req, res) => {
//   res.send(
//     `hello passport  <br / > <a href ='/auth/google' >로그인 < /a > <br / >
//     <a href ='/logout' >로그아웃 < /a > <br / >
//     <a href ='/protected' >개인정보 < /a > <br / >
//     ${req.user && req.user.displayName} <br / >`
//   );
// });

passport.serializeUser((user, done) => {
  // Strategy 성공 시 호출됨
  // console.log("serializeUser");
  done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
});

passport.deserializeUser((user, done) => {
  // console.log("deserializeUser");
  // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
  done(null, user); // 여기의 user가 req.user가 됨
});

passport.use(GoogleStrategy);
passport.use(JwtStrategy);

server.express.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login", "email"]
  })
);

server.express.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    /**
     * google API로 인증받은 후 front-end 로 controll 넘겨서 처리
     */
    const { flag, data } = req.user;
    if (flag) {
      res.redirect("http://localhost:3000");
    } else {
      res.redirect("http://localhost:3000/join/callback?email=" + data.email);
    }
  }
);

server.express.post("/auth/jwt", (req, res) => {
  console.log("req body", req.body);
  const { email } = req.body;
  const opts = {
    expiresIn: "1m"
  };
  const token = jwt.sign({ email }, jwtSecret, opts);
  // passport.authenticate("jwt", { session: false });

  return res.status(200).json({
    message: "success",
    jwtToken: token
  });
});

server.express.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    console.log(req.body);
  }
);

server.express.use(logger("dev"));
server.start({ port: PORT }, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
