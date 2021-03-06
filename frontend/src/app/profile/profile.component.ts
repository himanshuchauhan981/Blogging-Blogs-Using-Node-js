import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router, ActivatedRoute } from '@angular/router'

import { ProfileService, User } from '../service/profile.service'


@Component({
	selector: 'profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

	user : User = null

	authorized: Boolean = false

	name : string

	defaultProfileImage : string

	profileId : string

	constructor(
		private router: Router,
		public matDialog: MatDialog,
		private profileService: ProfileService,
		private activatedRoute: ActivatedRoute
	) { }

	ngOnInit() {
		this.defaultProfileImage = this.profileService.defaultProfileImage

		this.activatedRoute.params.subscribe(params =>{
			this.profileId = params.id
			this.profileService.getProfile()
		})
	}

	edit(){
		this.router.navigate(['edit'],{relativeTo: this.activatedRoute})
	}

}