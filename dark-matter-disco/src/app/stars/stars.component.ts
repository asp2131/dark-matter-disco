import { Component, OnInit, Input, Output } from '@angular/core';
import { LiveSocketService } from '../live-socket.service';
import { ConfigService } from '../config.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css']
})
export class StarsComponent implements OnInit {

  private starsSubscription: Subscription
  constructor(private liveSocketService: LiveSocketService, private configService: ConfigService) { }

  @Input() danceBuddies: any;
  @Input() username: any;
  @Input() gotStar: boolean;
  @Input() recievedStar: any;

  ngOnInit() {
    this.liveSocketService.on('stars', (toUsername, fromUsername) => {
      console.log(this.danceBuddies);
      let users = Object.keys(this.danceBuddies);
      if (users.includes(toUsername)) {
        this.star(toUsername);
        // this.danceBuddies[toUsername].gotStar = true;
      } else if (this.username === toUsername) {
        console.log(this.username, '2nd star cond', toUsername);
        this.recievedStar();
        // this.configService.addingStars(toUsername);
      }
      this.starsSubscription = this.configService.getStarCount(toUsername).subscribe((res) => {
        console.log('res', res);
        this.danceBuddies[toUsername].starCount = res[0].starsTotal;
        // this.danceBuddies[guest] = {watch: true, poseStream: new Subject(), gotStar: false, starCount: this.stars};
      }, (err) => console.error(err), () => {});
      // this.configService.addingStars(toUsername);
    })

    // this.lookupStars();
  }

  addStar(username) {
    // let username = Object.keys(username)
    console.log('clicked adding star to ', username);
    this.liveSocketService.emit('stars', username, this.username);
    this.star(username);
    this.configService.addingStars(username);
  }

  star(username) {
    this.danceBuddies[username].gotStar = true;
    this.danceBuddies[username].starCount++;
    setTimeout(() => {
      this.danceBuddies[username].gotStar = false;
    }, 3000);
  }

  // lookupStars() {
  //   let users = Object.keys(this.danceBuddies);
  //   users.forEach((user) => {
  //     let stars = this.configService.getStarCount(user);
  //     this.danceBuddies[user].starCount = stars;
  //     console.log(this.danceBuddies);
  //   })
  // }

}
