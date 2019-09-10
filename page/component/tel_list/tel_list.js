Page({
	data: {
		tel_list: [
			{
				title: '热线电话',
				number: '(86) 0755 2927 6688',
			},

			{
				title: '福田口岸站',
				number: '(86) 0755 2927 6500',
			},
			{
				title: '福民站',
				number: '(86) 0755 2927 6600',
			},
			{
				title: '会展中心站',
				number: '(86) 0755 2927 6700',
			},
			{
				title: '市民中心站',
				number: '(86) 0755 2927 6800',
			},
			{
				title: '少年宫站',
				number: '(86) 0755 2927 6900',
			},
			{
				title: '莲花北站',
				number: '(86) 0755 2927 7000',
			},
			{
				title: '上梅林站',
				number: '(86) 0755 2927 7100',
			},
			{
				title: '民乐站',
				number: '(86) 0755 2927 7200',
			},
			{
				title: '白石龙站',
				number: '(86) 0755 2927 7300',
			},
			{
				title: '深圳北站',
				number: '(86) 0755 2927 7400',
			},
			{
				title: '红山站',
				number: '(86) 0755 2927 7500',
			},
			{
				title: '上塘站',
				number: '(86) 0755 2927 7600',
			},
			{
				title: '龙胜站',
				number: '(86) 0755 2927 7700',
			},
			{
				title: '龙华站',
				number: '(86) 0755 2927 7800',
			},
			{
				title: '清湖站',
				number: '(86) 0755 2927 7900',
			},
		],
	},
	tel(e){
		wx.makePhoneCall({
			phoneNumber: e.currentTarget.id,
		})
	},
});